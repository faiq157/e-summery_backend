const mongoose = require('mongoose');
require('dotenv').config();

// Enable MongoDB query profiling
async function enableProfiling() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/e-summery');
    console.log('Connected to MongoDB');

    // Set profiling level to log all operations
    await mongoose.connection.db.admin().command({
      profile: 2, // 0=off, 1=slow queries, 2=all queries
      slowms: 100 // Log queries slower than 100ms
    });

    console.log('✅ MongoDB profiling enabled');
    console.log('📊 All queries will be logged to system.profile collection');
    console.log('⏱️  Queries slower than 100ms will be highlighted');

  } catch (error) {
    console.error('❌ Error enabling profiling:', error);
  }
}

// Analyze slow queries
async function analyzeSlowQueries() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/e-summery');
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    
    // Get slow queries from system.profile
    const slowQueries = await db.collection('system.profile')
      .find({ millis: { $gt: 100 } })
      .sort({ millis: -1 })
      .limit(20)
      .toArray();

    console.log(`\n🐌 Found ${slowQueries.length} slow queries (>100ms):`);
    
    slowQueries.forEach((query, index) => {
      console.log(`\n${index + 1}. Query took ${query.millis}ms`);
      console.log(`   Collection: ${query.ns}`);
      console.log(`   Operation: ${query.op}`);
      console.log(`   Query: ${JSON.stringify(query.query, null, 2)}`);
      if (query.updateobj) {
        console.log(`   Update: ${JSON.stringify(query.updateobj, null, 2)}`);
      }
    });

    // Get index usage statistics
    console.log('\n📈 Index Usage Statistics:');
    const collections = ['users', 'notesheets', 'approvals', 'roles', 'approvalroles', 'notifications', 'pushnotificationtokens'];
    
    for (const collectionName of collections) {
      try {
        const stats = await db.collection(collectionName).stats();
        console.log(`\n${collectionName.toUpperCase()}:`);
        console.log(`  - Documents: ${stats.count}`);
        console.log(`  - Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
        console.log(`  - Indexes: ${stats.nindexes}`);
        console.log(`  - Index size: ${(stats.totalIndexSize / 1024 / 1024).toFixed(2)} MB`);
      } catch (error) {
        console.log(`  - Collection not found or error: ${error.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Error analyzing slow queries:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Get index usage information
async function getIndexUsage() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/e-summery');
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    
    console.log('\n🔍 Index Usage Information:');
    
    // Get index usage stats for each collection
    const collections = ['users', 'notesheets', 'approvals', 'roles', 'approvalroles', 'notifications', 'pushnotificationtokens'];
    
    for (const collectionName of collections) {
      try {
        const indexes = await db.collection(collectionName).indexes();
        console.log(`\n${collectionName.toUpperCase()} indexes:`);
        
        indexes.forEach(index => {
          console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
          if (index.unique) {
            console.log(`    (Unique index)`);
          }
        });
      } catch (error) {
        console.log(`  - Collection not found: ${error.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Error getting index usage:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Export functions for use in other scripts
module.exports = {
  enableProfiling,
  analyzeSlowQueries,
  getIndexUsage
};

// Run specific function based on command line argument
const command = process.argv[2];

switch (command) {
  case 'profile':
    enableProfiling();
    break;
  case 'analyze':
    analyzeSlowQueries();
    break;
  case 'indexes':
    getIndexUsage();
    break;
  default:
    console.log('Usage: node performanceMonitor.js [profile|analyze|indexes]');
    console.log('  profile  - Enable MongoDB query profiling');
    console.log('  analyze  - Analyze slow queries');
    console.log('  indexes  - Show index usage information');
} 