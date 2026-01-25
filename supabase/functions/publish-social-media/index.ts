// Supabase Edge Function for Social Media Publishing
// Deploy with: npx supabase functions deploy publish-social-media

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PublishRequest {
    publicacion_id: string;
}

interface SocialConfig {
    platform: string;
    access_token: string;
    page_id?: string;
    account_id?: string;
    is_active: boolean;
}

// Facebook Graph API
async function publishToFacebook(
    pageId: string,
    accessToken: string,
    message: string,
    imageUrl?: string
): Promise<{ success: boolean; postId?: string; error?: string }> {
    try {
        const endpoint = imageUrl
            ? `https://graph.facebook.com/v18.0/${pageId}/photos`
            : `https://graph.facebook.com/v18.0/${pageId}/feed`;

        const params = new URLSearchParams({
            access_token: accessToken,
            message: message,
        });

        if (imageUrl) {
            params.append('url', imageUrl);
        }

        const response = await fetch(`${endpoint}?${params}`, { method: 'POST' });
        const data = await response.json();

        if (data.error) {
            return { success: false, error: data.error.message };
        }

        return { success: true, postId: data.id || data.post_id };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// Instagram Graph API (Business Account via Facebook)
async function publishToInstagram(
    accountId: string,
    accessToken: string,
    caption: string,
    imageUrl: string
): Promise<{ success: boolean; postId?: string; error?: string }> {
    try {
        // Step 1: Create media container
        const containerResponse = await fetch(
            `https://graph.facebook.com/v18.0/${accountId}/media`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    image_url: imageUrl,
                    caption: caption,
                    access_token: accessToken,
                }),
            }
        );

        const containerData = await containerResponse.json();
        if (containerData.error) {
            return { success: false, error: containerData.error.message };
        }

        const containerId = containerData.id;

        // Step 2: Publish the container
        const publishResponse = await fetch(
            `https://graph.facebook.com/v18.0/${accountId}/media_publish`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    creation_id: containerId,
                    access_token: accessToken,
                }),
            }
        );

        const publishData = await publishResponse.json();
        if (publishData.error) {
            return { success: false, error: publishData.error.message };
        }

        return { success: true, postId: publishData.id };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// TikTok Video Upload (requires video URL)
async function publishToTikTok(
    accessToken: string,
    caption: string,
    videoUrl: string
): Promise<{ success: boolean; postId?: string; error?: string }> {
    try {
        // TikTok requires video content - text-only posts not supported
        if (!videoUrl) {
            return { success: false, error: 'TikTok requires video content' };
        }

        // Note: TikTok API is more complex and requires OAuth flow
        // This is a simplified placeholder - full implementation requires:
        // 1. OAuth authorization
        // 2. Video upload to TikTok servers
        // 3. Post creation with upload ID

        const response = await fetch('https://open.tiktokapis.com/v2/post/publish/video/init/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
                post_info: {
                    title: caption.substring(0, 150), // TikTok title limit
                    privacy_level: 'PUBLIC_TO_EVERYONE',
                },
                source_info: {
                    source: 'PULL_FROM_URL',
                    video_url: videoUrl,
                },
            }),
        });

        const data = await response.json();

        if (data.error?.code) {
            return { success: false, error: data.error.message };
        }

        return { success: true, postId: data.data?.publish_id };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

Deno.serve(async (req) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        const { publicacion_id }: PublishRequest = await req.json();

        if (!publicacion_id) {
            return new Response(
                JSON.stringify({ error: 'publicacion_id is required' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // Get the publication
        const { data: publication, error: pubError } = await supabaseClient
            .from('publicaciones')
            .select('*')
            .eq('id', publicacion_id)
            .single();

        if (pubError || !publication) {
            return new Response(
                JSON.stringify({ error: 'Publication not found' }),
                { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // Get social media configurations
        const { data: configs } = await supabaseClient
            .from('social_media_config')
            .select('*')
            .eq('is_active', true);

        const results: Record<string, any> = {};
        const updates: Record<string, any> = {};

        // Process each platform
        for (const config of (configs || []) as SocialConfig[]) {
            const content = `${publication.title}\n\n${publication.content}`;

            if (config.platform === 'facebook' && publication.facebook_status === 'pending') {
                const result = await publishToFacebook(
                    config.page_id!,
                    config.access_token,
                    content,
                    publication.image_url
                );
                results.facebook = result;
                updates.facebook_status = result.success ? 'published' : 'failed';
                updates.facebook_post_id = result.postId;
                updates.facebook_error = result.error;
                updates.facebook_published_at = result.success ? new Date().toISOString() : null;
            }

            if (config.platform === 'instagram' && publication.instagram_status === 'pending') {
                if (!publication.image_url) {
                    results.instagram = { success: false, error: 'Instagram requires an image' };
                    updates.instagram_status = 'failed';
                    updates.instagram_error = 'Instagram requires an image';
                } else {
                    const result = await publishToInstagram(
                        config.account_id!,
                        config.access_token,
                        content,
                        publication.image_url
                    );
                    results.instagram = result;
                    updates.instagram_status = result.success ? 'published' : 'failed';
                    updates.instagram_post_id = result.postId;
                    updates.instagram_error = result.error;
                    updates.instagram_published_at = result.success ? new Date().toISOString() : null;
                }
            }

            if (config.platform === 'tiktok' && publication.tiktok_status === 'pending') {
                if (!publication.video_url) {
                    results.tiktok = { success: false, error: 'TikTok requires a video' };
                    updates.tiktok_status = 'failed';
                    updates.tiktok_error = 'TikTok requires a video';
                } else {
                    const result = await publishToTikTok(
                        config.access_token,
                        content,
                        publication.video_url
                    );
                    results.tiktok = result;
                    updates.tiktok_status = result.success ? 'published' : 'failed';
                    updates.tiktok_post_id = result.postId;
                    updates.tiktok_error = result.error;
                    updates.tiktok_published_at = result.success ? new Date().toISOString() : null;
                }
            }
        }

        // Update publication with results
        if (Object.keys(updates).length > 0) {
            await supabaseClient
                .from('publicaciones')
                .update({ ...updates, updated_at: new Date().toISOString() })
                .eq('id', publicacion_id);
        }

        return new Response(
            JSON.stringify({ success: true, results }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    } catch (error: any) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
});
