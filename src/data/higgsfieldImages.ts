// Sursa unica pentru imaginile Higgsfield folosite in homepage-ul redesenat.
// NOTE: momentan hotlink direct din CloudFront (Higgsfield). Pentru productie,
// descarca-le in /public/images/higgsfield/ si inlocuieste URL-urile cu cai locale,
// ca sa nu depindem de expirarea link-urilor CloudFront.

const CDN = 'https://d8j0ntlcm91z4.cloudfront.net/user_3Dx2EbQK65wrMAti72HE0fMsbCA';

export const HF = {
    // Hero (cinematic_studio_2_5)
    hero: `${CDN}/hf_20260725_212620_6f7bc0f3-4526-401f-addc-3aa81a6c22b3.png`,

    // Colectii (nano_banana_2 + cinematic)
    imperial: `${CDN}/hf_20260725_162316_e82db97c-3c2c-494c-bde6-70a9080858fd.png`,
    anna: `${CDN}/hf_20260725_162316_95bdd9d6-f13e-40a9-be65-e70309f912c4.png`,
    mayra: `${CDN}/hf_20260725_162312_c0970d98-58c6-4bdf-9e83-7a2c0e6bbbb2.png`,
    beverly: `${CDN}/hf_20260725_162312_8be38b88-1371-4b9b-90d4-72bccc174c90.png`,

    // Atelier (cinematic_studio_2_5)
    atelier: `${CDN}/hf_20260725_212615_94c43622-8a7b-4f83-9244-865a1e6c95e0.png`,
} as const;
