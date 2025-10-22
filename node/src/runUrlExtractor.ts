import type  {JobUrlExtractor , JobUrl } from "./base.js";

const jobUrlExtractors : JobUrlExtractor[] = [
    require("./url/extractor/tossUrlExtractor.ts"),
    require("./url/extractor/naverUrlExtractor.ts"),
    require("./url/extractor/donamuUrlExtractor.ts"),
    require("./url/extractor/lineUrlExtractor.ts"),
    require("./url/extractor/ktUrlExtractor.ts"),
    require("./url/extractor/sktUrlExtractor.ts")
];



( async () => {

    for ( const extractor of jobUrlExtractors ) {

        const jobUrls = await extractor.extractJobUrls();

        if ( jobUrls && jobUrls.length > 0 ) {
            console.log( `Extracted ${ jobUrls.length } job URLs from ${ extractor.getDomain() }` );
        }
    }
    return null;

})();    