import type  {JoBUrlExtractor , JobUrl } from "./base.js";

const jobUrlExtractors : JoBUrlExtractor[] = [
    require("./tossUrlExtractor.ts"),
];



( async () => {

    for ( const extractor of jobUrlExtractors ) {

        const jobUrls = await extractor.extractJobUrls();

        if ( jobUrls && jobUrls.length > 0 ) {

            console.log( `Extracted ${ jobUrls.length } job URLs from ${ extractor.getDomain() }` );

            return jobUrls;

        }

    }

    return null;

})();    