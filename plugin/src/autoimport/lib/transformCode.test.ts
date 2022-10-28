import { describe, it, expect } from 'vitest'
import { createAliasObjectLiteral } from './transformCode'


describe("Transform Code", () => {
    describe("createAliasObjectLiteral", () => {
        it("creates a string, if passed only a string", () => {
            const literal: string = createAliasObjectLiteral("alias");
            expect(literal).toBe("alias");
        })

        it("creates an object literal, if passed an object with one property", () => {
            const literal: string = createAliasObjectLiteral({
                key: "value"
            });
            expect(withoutWhitespace(literal)).toEqual(withoutWhitespace('{"key" : value,}'));
        })

        it("creates an object literal, if passed an object with multiple properties", ()=> {
            const literal: string = createAliasObjectLiteral({
                key1: "value1",
                key2: "value2"
            });
            expect(withoutWhitespace(literal)).toEqual(withoutWhitespace('{"key1" : value1,"key2":value2,}'));
        })
        it("creates an object literal, if passsed a nested object", ()=> {
            const literal: string = createAliasObjectLiteral({
                outerKey: {
                    innerKey: "value"
                }
            });
            expect(withoutWhitespace(literal)).toEqual(withoutWhitespace('{"outerKey" : {"innerKey":value,},}'));
        })
    })
})

function withoutWhitespace(string: string) {
    return string.replace(/\s/g, "");
}