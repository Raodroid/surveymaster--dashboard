import { createPayloadAction, createAction } from '../helpers';

describe('auth actions creators', () => {
  it('createAction helper', () => {
    const type = 'type';
    const meta = 'meta';
    const error = 'error';
    const callback = () => {};
    expect(createAction(type, meta, error, callback)).toEqual({
      type,
      meta,
      error,
      callback,
    });
  });
  it('createPayloadAction helper', () => {
    const type = 'type';
    const payload = 'payload';
    const meta = 'meta';
    const error = 'error';
    const callback = () => {};
    expect(createPayloadAction(type, payload, meta, error, callback)).toEqual({
      ...createAction(type, meta, error, callback),
      payload,
    });
  });
});
