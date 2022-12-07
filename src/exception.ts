export class UnitIDException implements Error {

    constructor(
        public name: string,
        public message: string,
    ) { }
}