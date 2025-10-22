import type  {JobUrlExtractor , JobUrl } from "./base.js";

const jobUrlExtractors : JobUrlExtractor[] = [
    // require("./url/tossUrlExtractor.ts"),
    // require("./url/naverUrlExtractor.ts"),
    require("./url/donamuUrlExtractor.ts")
];



( async () => {

    for ( const extractor of jobUrlExtractors ) {

        const jobUrls = await extractor.extractJobUrls();

        if ( jobUrls && jobUrls.length > 0 ) {

            console.log( `Extracted ${ jobUrls.length } job URLs from ${ extractor.getDomain() }` );
            console.log( jobUrls );
            return jobUrls;
        }
    }
    return null;

})();    