import AwsSdkMock from 'aws-sdk-mock';
import { postProduct as postProductOriginal } from '../../utils';
import Records from '../../mocks/records.json';
import { catalogBatchProcess } from './catalogBatchProcess';

jest.mock('../../utils/postProduct/postProduct.ts');

const postProduct = postProductOriginal as jest.Mock;

describe('catalogBatchProcess handler', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should post all the products in Records', async () => {
    postProduct.mockResolvedValue({ data: {} });
    const snsPublishMock = jest.fn((_params, callback) => callback(null));
    AwsSdkMock.mock('SNS', 'publish', snsPublishMock);

    await catalogBatchProcess({ Records });

    expect(postProduct.mock.calls).toEqual([
      [Records[0].body],
      [Records[1].body],
      [Records[2].body],
    ]);

    expect(snsPublishMock.mock.calls[0][0].Message).toEqual(Records[0].body);
    expect(snsPublishMock.mock.calls[1][0].Message).toEqual(Records[1].body);
    expect(snsPublishMock.mock.calls[2][0].Message).toEqual(Records[2].body);
  });
});
