import * as fs from 'fs';
import * as path from 'path';

export const notes = {
  // IMPERIAL
  "Alma": { notes: ["front full view", "back full view showing open back and bow", "close up detail of the back waist bow"], missing: ["profile"] },
  "Argente": { notes: ["front full view with skirt spread out", "front full view walking", "back and side profile view", "close up detail of the sleeve and bodice beading"], missing: ["back"] },
  "Aurelia": { notes: ["back full view showing the train", "close up detail of the front bodice", "close up detail of the back bodice", "front full view"], missing: ["profile"] },
  "Daiana": { notes: ["front full view", "side profile view", "back full view", "close up detail of front bodice", "side and train detail"], missing: [] },
  "Elia": { notes: ["front full view", "back full view", "close up detail of the front bodice", "close up detail of the back and train", "front full view in different lighting"], missing: ["profile"] },
  "Elise": { notes: ["front full view", "side profile view", "back full view", "close up detail of the back corset"], missing: [] },
  "Evora": { notes: ["front full view", "back full view", "close up detail of front bodice", "detail of back", "front half view"], missing: ["profile"] },
  "Ivory Grace": { notes: ["front full view", "back full view", "side profile detail"], missing: [] },
  "Lumiere": { notes: ["front half view showing bodice and sleeves"], missing: ["back", "profile", "detail"] },
  "Mayson": { notes: ["front full view", "back full view", "front half view", "detail of sleeve and bodice", "front full view looking down"], missing: ["profile"] },
  "Queen": { notes: ["front full view", "back full view", "front half view"], missing: ["profile", "detail"] },
  "Serena": { notes: ["front full view", "back full view", "side profile view", "close up detail of back", "close up detail of front bodice"], missing: [] },

  // ANNA
  "Anais": { notes: ["front half view", "back full view", "front full view"], missing: ["profile", "detail"] },
  "Anamara": { notes: ["neck and shoulder close up", "back full view", "front full view"], missing: ["profile"] },
  "Anamaria": { notes: ["back full view", "front full view", "detail shoulder on mannequin", "detail shoulder on mannequin"], missing: ["profile"] },
  "Anaria": { notes: ["front full view", "back half view looking over shoulder", "back full view"], missing: ["profile", "detail"] },
  "Anastasia": { notes: ["back full view", "front full view", "back full view looking over shoulder"], missing: ["profile", "detail"] },
  "Anastea": { notes: ["corset back detail on mannequin", "back full view", "front full view", "front half view"], missing: ["profile"] },
  "Anatolia": { notes: ["front full view", "back full view"], missing: ["profile", "detail"] },
  "Anavelle": { notes: ["back full view", "front full view", "side full view"], missing: ["detail"] },
  "Anelie": { notes: ["front half view", "front full view", "back full view"], missing: ["profile", "detail"] },
  "Annabelle": { notes: ["back full view", "back half view", "front full view", "detail of sleeve beading"], missing: ["profile"] },
  "Annador": { notes: ["front full view", "back full view"], missing: ["profile", "detail"] },
  "Annette": { notes: ["front half view", "front full view", "side full view", "detail of bodice on mannequin"], missing: ["back"] },
  "Just Anna": { notes: ["front full view", "back full view"], missing: ["profile", "detail"] },

  // MAYRA
  "Adania": { notes: ["front full view", "back full view", "front half view", "detail of bodice on mannequin"], missing: ["profile"] },
  "Celina": { notes: ["side full view sitting", "back half view looking over shoulder", "back full view walking", "detail of shoulder beading"], missing: ["front"] },
  "Desideria": { notes: ["front full view", "back full view", "detail of bodice on mannequin", "detail of back beading"], missing: ["profile"] },
  "Elvira": { notes: ["front full view", "front full view with skirt spread", "back full view"], missing: ["profile", "detail"] },
  "Grazia": { notes: ["front full view", "back full view with bridesmaids", "detail of shoulder sleeve on mannequin"], missing: ["profile"] },
  "Isadora": { notes: ["front full view", "back full view", "detail of bodice on mannequin"], missing: ["profile"] },
  "Luminia": { notes: ["front full view with skirt spread", "back full view", "back full view looking over shoulder", "detail of cape on mannequin"], missing: ["profile"] },
  "Miracle": { notes: ["front full view", "side full view sitting", "detail of front bodice on mannequin", "detail of back on mannequin"], missing: ["back"] },
  "Roze": { notes: ["front full view", "back full view looking over shoulder"], missing: ["profile", "detail"] },
  "Snow": { notes: ["back full view", "front full view", "front full view looking over shoulder", "back full view with skirt spread"], missing: ["profile", "detail"] },
  "Tania": { notes: ["front full view", "side profile view", "back full view", "detail of back waist flowers"], missing: [] },
  "Taniana": { notes: ["front full view", "back full view", "detail of back corset"], missing: ["profile"] },

  // BEVERLY
  "Aveline": { notes: ["front full view", "back full view"], missing: ["profile", "detail"] },
  "Beauty": { notes: ["front full view", "front full view with leg slit", "detail of back beading"], missing: ["profile", "back"] },
  "Bety": { notes: ["detail of front bodice", "back full view with leg slit", "front full view"], missing: ["profile"] },
  "Candy": { notes: ["back full view", "back full view with skirt spread", "front full view"], missing: ["profile", "detail"] },
  "Cediz": { notes: ["back full view", "front full view", "detail of front bodice"], missing: ["profile"] },
  "Celestia": { notes: ["front full view", "back full view"], missing: ["profile", "detail"] },
  "Fyona": { notes: ["back full view", "front full view", "detail of front bodice"], missing: ["profile"] },
  "Marisa": { notes: ["side full view", "front full view", "detail of front bodice", "front full view looking down"], missing: ["back"] },
  "Nolli": { notes: ["front full view", "back full view", "detail of front bodice", "detail of back bodice"], missing: ["profile"] },
  "Solea": { notes: ["front full view", "back full view", "front full view with skirt spread"], missing: ["profile", "detail"] },
  "Valensia": { notes: ["back full view looking over shoulder", "front full view"], missing: ["profile", "detail"] }
};

export const has_face_cache = {
  // IMPERIAL
  "Alma": true,
  "Argente": true,
  "Aurelia": false,
  "Daiana": true,
  "Elia": true,
  "Elise": true,
  "Evora": true,
  "Ivory Grace": true,
  "Lumiere": true,
  "Mayson": true,
  "Queen": true,
  "Serena": true,

  // ANNA
  "Anais": true,
  "Anamara": false,
  "Anamaria": false,
  "Anaria": true,
  "Anastasia": false,
  "Anastea": false,
  "Anatolia": true,
  "Anavelle": false,
  "Anelie": true,
  "Annabelle": false,
  "Annador": true,
  "Annette": true,
  "Just Anna": true,

  // MAYRA
  "Adania": true,
  "Celina": true,
  "Desideria": true,
  "Elvira": true,
  "Grazia": true,
  "Isadora": true,
  "Luminia": true,
  "Miracle": true,
  "Roze": true,
  "Snow": false,
  "Tania": true,
  "Taniana": true,

  // BEVERLY
  "Aveline": true,
  "Beauty": true,
  "Bety": true,
  "Candy": true,
  "Cediz": true,
  "Celestia": true,
  "Fyona": true,
  "Marisa": true,
  "Nolli": true,
  "Solea": true,
  "Valensia": true
};
