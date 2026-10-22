import { useCallback, useState } from 'react';
import { InvitationShell } from './components/layout/InvitationShell';
import { Viewport } from './components/layout/Viewport';
import { SceneInvitation } from './components/scenes/SceneInvitation';
import { SceneOpening } from './components/scenes/SceneOpening';
import { SceneSecretGate } from './components/scenes/SceneSecretGate';
import type { SceneId } from './config/scenes';

export default function App() {
  const [scene, setScene] = useState<SceneId>('opening');

  const goTo = useCallback((next: SceneId) => {
    setScene(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <Viewport>
      <InvitationShell scene={scene}>
        {scene === 'opening' && <SceneOpening onComplete={() => goTo('invitation')} />}
        {scene === 'invitation' && <SceneInvitation onComplete={() => goTo('secret-gate')} />}
        {scene === 'secret-gate' && <SceneSecretGate />}
      </InvitationShell>
    </Viewport>
  );
}
