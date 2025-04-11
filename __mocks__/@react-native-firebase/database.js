export default () => ({
  ref: jest.fn(() => ({
    on: jest.fn(),
    once: jest.fn(),
    set: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
});
