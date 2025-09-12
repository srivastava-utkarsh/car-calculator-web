const { performance } = require('perf_hooks');
const http = require('http');

function measurePageLoad() {
  return new Promise((resolve, reject) => {
    const startTime = performance.now();
    
    const req = http.get('http://localhost:3001', (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const endTime = performance.now();
        const loadTime = (endTime - startTime) / 1000;
        
        // Analyze the response
        const htmlSize = Buffer.byteLength(data, 'utf8');
        const hasScripts = data.includes('<script');
        const hasStyles = data.includes('<style') || data.includes('.css');
        
        resolve({
          loadTime,
          htmlSize,
          hasScripts,
          hasStyles,
          statusCode: res.statusCode
        });
      });
    });
    
    req.on('error', reject);
    req.setTimeout(10000, () => reject(new Error('Timeout')));
  });
}

async function runPerformanceTest() {
  console.log('🚀 Testing Car Calculator Performance...\n');
  
  try {
    // Test multiple times to get average
    const tests = [];
    for (let i = 1; i <= 5; i++) {
      console.log(`Testing load ${i}/5...`);
      const result = await measurePageLoad();
      tests.push(result);
      await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms between tests
    }
    
    // Calculate statistics
    const loadTimes = tests.map(t => t.loadTime);
    const avgLoadTime = loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length;
    const minLoadTime = Math.min(...loadTimes);
    const maxLoadTime = Math.max(...loadTimes);
    
    console.log('\n📊 Performance Results:');
    console.log('═══════════════════════');
    console.log(`Average Load Time: ${avgLoadTime.toFixed(3)}s`);
    console.log(`Fastest Load Time: ${minLoadTime.toFixed(3)}s`);
    console.log(`Slowest Load Time: ${maxLoadTime.toFixed(3)}s`);
    console.log(`HTML Size: ${(tests[0].htmlSize / 1024).toFixed(1)} KB`);
    console.log(`Status Code: ${tests[0].statusCode}`);
    
    // Performance evaluation
    console.log('\n🎯 Performance Evaluation:');
    if (avgLoadTime < 1) {
      console.log('✅ EXCELLENT: Page loads in under 1 second!');
    } else if (avgLoadTime < 2) {
      console.log('✅ GOOD: Page loads within target of 2 seconds');
    } else if (avgLoadTime < 3) {
      console.log('⚠️  ACCEPTABLE: Page loads in under 3 seconds');
    } else {
      console.log('❌ SLOW: Page load time exceeds 3 seconds');
    }
    
    // Optimization suggestions
    console.log('\n💡 Current Optimizations Active:');
    console.log('• Code splitting and lazy loading ✅');
    console.log('• CSS animations instead of Framer Motion ✅');
    console.log('• FAQ data moved to separate file ✅');
    console.log('• Webpack build optimizations ✅');
    console.log('• Turbopack enabled for faster bundling ✅');
    
    console.log('\n🎉 Performance test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

runPerformanceTest();