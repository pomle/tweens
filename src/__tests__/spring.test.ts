import { spring } from '../spring';

describe('Spring', () => {
  it('provides reference to tweenable based on init', () => {
    const tweenable = {
      a: 2,
      b: 3,
    };

    const tween = spring(tweenable);

    expect(tween.value).toBe(tweenable);
  });

  describe('#to', () => {
    it('sets the goal of the tween and engages tweening on update', () => {
      const tween = spring({ x: 1, y: 2 });
      tween.to({ x: 3, y: 10 });
      expect(tween.update(0.1)).toBe(true);
      expect(tween.value).toEqual({ x: 1.8, y: 5.2 });
    });
  });

  describe('#set', () => {
    it('sets the internal value immediately', () => {
      const tween = spring({ x: 1, y: 2 });
      tween.set({ x: 3, y: 10 });
      expect(tween.value).toEqual({ x: 3, y: 10 });
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
      expect(tween.value).toEqual({ x: 1.8, y: 5.2 });
      tween.clear();
      expect(tween.update(0.1)).toBe(false);
      expect(tween.value).toEqual({ x: 1.8, y: 5.2 });
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

    it('simulates until goal met', () => {
      const tween = spring(
        { x: 1 },
        { stiffness: 1, mass: 1, friction: 1, precision: 0.01 },
      );
      tween.to({ x: 2 });

      let rounds = 0;
      while (tween.update(0.1)) {
        rounds++;
      }
      expect(rounds).toBe(45);
    });

    it('simulates with expected diff', () => {
      const tween = spring(
        { x: 1 },
        { stiffness: 1, mass: 1, friction: 1, precision: 0.01 },
      );
      tween.to({ x: 2 });
      expect(tween.update(0.1)).toBe(true);
      expect(tween.value).toEqual({ x: 1.1 });
    });

    it('settles to exact goal value on simulation end', () => {
      const tween = spring(
        { x: 1 },
        { stiffness: 1, mass: 1, friction: 1, precision: 0.01 },
      );
      tween.to({ x: 2 });
      while (tween.update(0.1));
      expect(tween.value).toEqual({ x: 2 });
    });

    it('does not contaminate values', () => {
      const tween = spring(
        { x: 1, y: 0, z: 0 },
        {
          stiffness: 40,
          mass: 100,
          friction: 25,
          precision: 0.000001,
        },
      );

      tween.to({ x: 0, y: 1, z: 0 });
      while (tween.update(1 / 60)) {
        expect(tween.value.z).toEqual(0);
      }
      expect(tween.value).toEqual({ x: 0, y: 1, z: 0 });

      tween.to({ x: 1, y: 0, z: 0 });
      while (tween.update(1 / 60)) {
        expect(tween.value.z).toEqual(0);
      }
      expect(tween.value).toEqual({ x: 1, y: 0, z: 0 });
    });
  });
});
