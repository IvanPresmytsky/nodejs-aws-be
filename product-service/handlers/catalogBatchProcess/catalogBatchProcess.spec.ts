import { postProduct as postProductOriginal } from '../../utils';
import { SNSClient as SNSClientOriginal } from '../../models';
import Records from '../../mocks/records.json';
import { catalogBatchProcess } from './catalogBatchProcess';

jest.mock('../../utils/postProduct/postProduct.ts');
jest.mock('../../models/SNSClient/SNSClient.ts');

const postProduct = postProductOriginal as jest.Mock;
const SNSClient = SNSClientOriginal as jest.Mock;


describe('catalogBatchProcess handler', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should post all the products in Records', async () => {
    console.log(SNSClient);
    postProduct.mockResolvedValue({ data: {} });
    await catalogBatchProcess({ Records });

    expect(postProduct.mock.calls).toEqual([
      [Records[0].body],
      [Records[1].body],
      [Records[2].body],
    ]);
  });
});
