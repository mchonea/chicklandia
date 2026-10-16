import fs from 'node:fs/promises';
const read=async name=>JSON.parse(await fs.readFile(new URL('./'+name,import.meta.url),'utf8'));
const [regression,coop,ui]=await Promise.all(['regression-checks.json','checks.json','ui-checks.json'].map(read));
const report={allPass:regression.allPass&&coop.allPass&&ui.allPass,regressionChecks:regression.checks,coopChecks:regression.suites.coop_interior.checks,galleryStates:ui.galleryStates,standalone:regression.suites.standalone.allPass&&coop.standalone.allPass,mobileStairsAndInspection:ui.mobileUpButton&&ui.mobileDownButton&&ui.mobileInspectButton,largeTextAndNight:ui.dayNightAndLargeTextFits,sources:{regression:'regression-checks.json',coop:'checks.json',ui:'ui-checks.json'}};
await fs.writeFile(new URL('./final-checks.json',import.meta.url),JSON.stringify(report,null,2));console.log(JSON.stringify(report));if(!report.allPass)process.exitCode=1;
