import type { ReactNode } from 'react';
import { SCENE_LABELS, type SceneId } from '../../config/scenes';
import { RandomCatPopup } from '../ui/RandomCatPopup';

type Props = {
  scene: SceneId;
  children: ReactNode;
};

export function InvitationShell({ scene, children }: Props) {
  return (
    <main className="invitation-shell" id="main-content">
      <p className="scene-eyebrow">{SCENE_LABELS[scene]}</p>
      <div className="scene-container scene-container--enter" key={scene}>
        <div className="scene-content">{children}</div>
      </div>
      {scene !== 'opening' && <RandomCatPopup />}
    </main>
  );
}
