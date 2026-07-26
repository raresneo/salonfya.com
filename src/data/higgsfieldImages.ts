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

// Galerie densa (stil Vero "masterpiece"). Ordine libera, se afiseaza intr-un grid mozaic.
// NOTE: URL-uri Higgsfield selectate din generarile cinematic_studio_2_5 / nano_banana_2.
export const HF_GALLERY: string[] = [
    `${CDN}/hf_20260725_212620_6f7bc0f3-4526-401f-addc-3aa81a6c22b3.png`,
    `${CDN}/hf_20260725_212615_94c43622-8a7b-4f83-9244-865a1e6c95e0.png`,
    `${CDN}/hf_20260725_212615_ba0423cd-ff33-4e09-9267-2725b6304e37.png`,
    `${CDN}/hf_20260725_212611_f1f581d9-44bc-4e0e-b1d2-e4ef523221c3.png`,
    `${CDN}/hf_20260725_212611_12b60a3d-2bbe-4aba-97c3-e2d5f115d122.png`,
    `${CDN}/hf_20260725_212417_08f93334-b13b-4cdc-9002-9ddf4af4c0e8.png`,
    `${CDN}/hf_20260725_212417_de2258b2-179e-4804-af76-515cf5cd5cf9.png`,
    `${CDN}/hf_20260725_212417_843bd6f0-0f5e-45c6-b96b-d4a24129cca2.png`,
    `${CDN}/hf_20260725_183806_ce00328a-54c5-4921-b716-19ffae47c130.png`,
    `${CDN}/hf_20260725_182618_36c1e16f-0878-41de-9cd3-09f85dce0c61.png`,
    `${CDN}/hf_20260725_165423_09ad723b-104a-409b-bdb6-cedd1540c7ad.png`,
    `${CDN}/hf_20260725_164948_127f3977-fc7c-4386-95e9-0da566945e3c.png`,
    `${CDN}/hf_20260725_162316_e82db97c-3c2c-494c-bde6-70a9080858fd.png`,
    `${CDN}/hf_20260725_162312_c0970d98-58c6-4bdf-9e83-7a2c0e6bbbb2.png`,
];
