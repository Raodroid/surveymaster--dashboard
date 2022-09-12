import AuthUtils from '../auth.utils';

describe('auth utils', () => {
  // it('no subdomain', () => {
  //   const windowSpy = jest.spyOn(global, 'window', 'get');
  //   windowSpy.mockImplementation(
  //     () =>
  //       ({
  //         location: {
  //           host: 'amili.com',
  //         },
  //       } as Window & typeof globalThis),
  //   );
  //   process.env.REACT_APP_DOMAIN = 'amili.com';
  //   expect(AuthUtils.getsubdomain()).toBe(null);
  //   windowSpy.mockClear();
  // });

  // it('get correct subdomain', () => {
  //   const windowSpy = jest.spyOn(global, 'window', 'get');
  //   windowSpy.mockImplementation(
  //     () =>
  //       ({
  //         location: {
  //           host: 'zigvy.amili.com',
  //         },
  //       } as Window & typeof globalThis),
  //   );
  //   process.env.REACT_APP_DOMAIN = 'amili.com';
  //   expect(AuthUtils.getsubdomain()).toBe('zigvy');
  //   windowSpy.mockClear();
  // });
});
