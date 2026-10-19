const finite = (...values) => values.every(Number.isFinite);

/**
 * Maps PongFall's centered simulation into a long, scrollable document.
 * `originY` is the document-space arena center when the run starts; the source
 * sim's falling distance advances that center down the document. Keep this
 * transform independent from rendering so page targets and source input share
 * the same tested coordinates.
 */
export function createPageWorldTransform({ originX, originY, scale }) {
  if (!finite(originX, originY, scale) || scale <= 0) {
    throw new TypeError('PongFall page-world origin and scale must be finite, with a positive scale.');
  }

  return {
    toDocument(point, travel) {
      if (!point || !finite(point.x, point.y, travel)) return null;
      return {
        x: originX + point.x * scale,
        y: originY + travel + point.y * scale,
      };
    },

    toWorld(point, travel) {
      if (!point || !finite(point.x, point.y, travel)) return null;
      return {
        x: (point.x - originX) / scale,
        y: (point.y - originY - travel) / scale,
      };
    },

    targetToWorld(rect, travel) {
      if (!rect || !finite(rect.x, rect.y, rect.width, rect.height, travel) || rect.width <= 0 || rect.height <= 0) return null;
      return {
        x: (rect.x - originX) / scale,
        y: (rect.y - originY - travel) / scale,
        width: rect.width / scale,
        height: rect.height / scale,
      };
    },
  };
}
