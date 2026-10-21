export type SceneId = 'opening' | 'invitation' | 'voting' | 'secret-gate';

export const SCENE_ORDER: SceneId[] = ['opening', 'invitation', 'voting', 'secret-gate'];

export const SCENE_LABELS: Record<SceneId, string> = {
  opening: 'THE GRAND OPENING',
  invitation: 'THE OFFICIAL INVITATION',
  voting: 'THE QUEEN VOTING',
  'secret-gate': 'THE SECRET GATE',
};
