// Separate esbuild entrypoint: bundles mermaid + svg-pan-zoom from
// node_modules into one fingerprinted file that is fetched at runtime
// (via a non-static dynamic import in mermaid-loader.js) only on pages
// that actually contain a diagram. Keeping it out of the core bundle is
// what preserves lazy loading.
import mermaid from 'mermaid';
import svgPanZoom from 'svg-pan-zoom';

export { mermaid, svgPanZoom };
