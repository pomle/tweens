import { spring } from '../spring';

describe('Spring', () => {
  it('provides reference to tweenable based on init', () => {
    const tweenable = {
      a: 2,
      b: 3,
    };

    const tween = spring(tweenable);

    expect(tween.values).toBe(tweenable);
  });

  describe('#to', () => {
    it('sets the goal of the tween and engages tweening on update', () => {
      const tween = spring({ x: 1, y: 2 });
      tween.to({ x: 3, y: 10 });
      expect(tween.update(0.1)).toBe(true);
      expect(tween.values).toEqual({ x: 1.8, y: 5.2 });
    });
  });

  describe('#set', () => {
    it('sets the internal value immediately', () => {
      const tween = spring({ x: 1, y: 2 });
      tween.set({ x: 3, y: 10 });
      expect(tween.values).toEqual({ x: 3, y: 10 });
    });

    it('aborts a tween', () => {
      const tween = spring({ x: 1, y: 2 });
      tween.to({ x: 3, y: 10 });
      expect(tween.update(0.1)).toBe(true);
      tween.set({ x: 10, y: 3 });
      expect(tween.update(0.1)).toBe(false);
    });
  });

  describe('#clear', () => {
    it('removes the goal and stops the tween at current value', () => {
      const tween = spring({ x: 1, y: 2 });
      tween.to({ x: 3, y: 10 });
      expect(tween.update(0.1)).toBe(true);
      expect(tween.values).toEqual({ x: 1.8, y: 5.2 });
      tween.clear();
      expect(tween.update(0.1)).toBe(false);
      expect(tween.values).toEqual({ x: 1.8, y: 5.2 });
    });
  });

  describe('#update', () => {
    it('returns true when transition occured', () => {
      const tween = spring({ x: 1, y: 2 });
      tween.to({ x: 3, y: 10 });
      expect(tween.update(0.1)).toBe(true);
    });

    it('returns false when no transition occured', () => {
      const tween = spring({ x: 1, b: 2 });
      expect(tween.update(0.1)).toBe(false);
    });
  });
});
