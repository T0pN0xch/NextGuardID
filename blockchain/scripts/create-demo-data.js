const hre = require("hardhat");

async function main() {
  const contractAddress = "0xb81988826bA44D5657309690b79a1137786cEb3d";
  
  const IdentityAudit = await hre.ethers.getContractFactory("IdentityAudit");
  const contract = IdentityAudit.attach(contractAddress);
  
  console.log("📝 Creating demo transactions for hackathon...");
  
  const demoUsers = [
    { name: "Ali bin Ahmad", mykad: "900101015678" },
    { name: "Siti binti Omar", mykad: "910202025678" },
    { name: "Rajesh a/l Kumar", mykad: "920303035678" }
  ];
  
  const platforms = [
    "Bank Negara Malaysia",
    "MySejahtera",
    "Touch 'n Go eWallet",
    "Shopee Malaysia",
    "Maxis",
    "Maybank2u",
    "LHDN"
  ];
  
  let txCount = 0;
  
  for (const user of demoUsers) {
    const userHash = hre.ethers.keccak256(
      hre.ethers.toUtf8Bytes(user.mykad)
    );
    
    // Create 2-3 transactions per user
    for (let i = 0; i < 3; i++) {
      const platform = platforms[Math.floor(Math.random() * platforms.length)];
      const actions = ["LOGIN", "CONSENT_GRANTED", "CONSENT_REVOKED"];
      const action = actions[Math.floor(Math.random() * actions.length)];
      
      try {
        const tx = await contract.logIdentityUsage(
          userHash,
          platform,
          action,
          `ipfs-demo-${txCount}`
        );
        
        await tx.wait();
        txCount++;
        
        console.log(`✅ ${user.name} -> ${platform} (${action})`);
        console.log(`   📄 https://amoy.polygonscan.com/tx/${tx.hash}`);
      } catch (error) {
        console.log(`⚠️  Skipped ${platform}: ${error.message}`);
      }
      
      // Wait a bit between transactions
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log(`\n🎉 Created ${txCount} demo transactions!`);
  console.log(`🔗 Contract: https://amoy.polygonscan.com/address/${contractAddress}`);
}

main().catch(console.error);