export type SceneId = 'opening' | 'invitation' | 'secret-gate';

export const SCENE_ORDER: SceneId[] = ['opening', 'invitation', 'secret-gate'];

export const SCENE_LABELS: Record<SceneId, string> = {
  opening: 'THE GRAND OPENING',
  invitation: 'THE OFFICIAL INVITATION',
  'secret-gate': 'THE SECRET GATE',
};
