// Quick test for Web3 Storage connectivity
import blockchainService from '../lib/blockchain';

export async function testWeb3StorageConnection() {
  try {
    console.log('🧪 Testing Web3 Storage connection...');
    
    const testData = {
      test: true,
      timestamp: new Date().toISOString(),
      message: 'Web3 Storage test upload'
    };

    const cid = await blockchainService.uploadToIPFS(testData, 'blockchain-log');
    
    console.log('✅ Web3 Storage test PASSED');
    console.log(`📦 Uploaded test data with CID: ${cid}`);
    console.log(`🔗 Access at: https://w3s.link/ipfs/${cid}`);
    
    return {
      success: true,
      cid: cid,
      ipfsUrl: `https://w3s.link/ipfs/${cid}`
    };
  } catch (error) {
    console.error('❌ Web3 Storage test FAILED:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

export default testWeb3StorageConnection;
