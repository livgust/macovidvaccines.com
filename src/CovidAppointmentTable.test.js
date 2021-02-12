import {
  act,
  render,
  screen
} from '@testing-library/react';

import CovidAppointmentTable from './CovidAppointmentTable';

import prod from '../test/fixtures/api/prod.json';
import noData from '../test/fixtures/api/no-data.json';

beforeAll(function() {
  jest.spyOn(window, 'fetch');
});

describe('the CovidAppointmentTable component', function() {
  describe('when api data is available', function() {
    beforeEach(function() {
      window.fetch.mockResolvedValueOnce({
        json: async () => prod,
        ok: true
      });
    });

    test('it correctly displays available appointments', async function() {
      await act(async function() {
        render(
          <CovidAppointmentTable />
        );
      });

      expect(await screen.findByText(/Berkshire Community College Field House/)).toBeInTheDocument();
    });
  });

  describe('when no api data is available', function() {
    beforeEach(function() {
      window.fetch.mockResolvedValueOnce({
        json: async () => noData,
        ok: true
      });
    });

    test('it displays a loader component', async function() {
      await act(async function() {
        render(
          <CovidAppointmentTable />
        );
      });

      // react-loader doesn't appear to expose any a11y attributes on the spinner it
      // renders, which means we can't use the testing-library's API to assert on the
      // presence of something; we have to assert on the absence of everything :(
      expect(screen.queryByText(/Only show locations with available appointments/)).toBeNull();
    });
  });

  describe('when the api endpoint can not be reached', function() {
    beforeEach(function() {
      window.fetch.mockImplementationOnce(() => Promise.reject(new TypeError('network error')));
    });

    test('it displays a loader component', async function() {
      await act(async function() {
        render(
          <CovidAppointmentTable />
        );
      });

      expect(screen.queryByText(/Only show locations with available appointments/)).toBeNull();
    });
  });
});
