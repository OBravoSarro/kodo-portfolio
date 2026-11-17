import { useEffect, useState } from 'react';

function canRender3D() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
    if (!gl) return false;
    // Release the probe context immediately: browsers cap live contexts.
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
}

/** `null` while checking, then whether the device can (and should) render 3D. */
export function useWebGL() {
  const [supported, setSupported] = useState<boolean | null>(null);
  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    setSupported(canRender3D() && !connection?.saveData);
  }, []);
  return supported;
}
