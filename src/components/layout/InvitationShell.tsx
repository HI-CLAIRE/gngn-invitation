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
        {/* 오프닝·마지막 관문은 배경이 화면 끝까지 차도록 여백 없이 */}
        <div className={`scene-content ${scene === 'invitation' ? '' : 'scene-content--bleed'}`.trim()}>
          {children}
        </div>
      </div>
      {scene !== 'opening' && <RandomCatPopup />}
    </main>
  );
}
