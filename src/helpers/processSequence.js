/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import {
    __,
    allPass,
    andThen,
    assoc,
    both,
    bind,
    compose,
    gt,
    length,
    lt,
    lte,
    match,
    modulo,
    otherwise,
    partialRight,
    pipe,
    prop,
    test,
    tap,
    ifElse,
} from "ramda";
import Api from "../tools/api";

const api = new Api();

const isLessThanTen = partialRight(lt, [10]);
const isGreaterThanTwo = partialRight(gt, [2]);
const isLessOrEqualOne = partialRight(lte, [1]);
const isLessThanTenAndGreaterThanTwo = both(isLessThanTen, isGreaterThanTwo);
const isNumCharsLessThanTenAndGreaterThanTwo = compose(isLessThanTenAndGreaterThanTwo, length);
const isPositiveNumericString = test(/^[0-9.]+$/);
const hasAtMostOnePoint = compose(isLessOrEqualOne, length, match(/\./g));
const isPositiveDecimalNumber = allPass([isPositiveNumericString, hasAtMostOnePoint]);
const getParamsForConvertNumberBaseApi = assoc("number", __, { from: 10, to: 2 });
const getBoundApiGet = (api) => bind(api.get, api);
const convertNumberBase = (api) => getBoundApiGet(api)("https://api.tech/numbers/base");
const getResult = prop("result");
const handleValidationError = (handler) => {
    handler("ValidationError");
};
const square = partialRight(Math.pow, [2]);
const moduloByThree = partialRight(modulo, [3]);
const getAnimalUrlById = (animalId) => `https://animals.tech/${animalId}`;
const getAnimal = (api) => compose(getBoundApiGet(api)(__, {}), getAnimalUrlById);

const validateString = allPass([isNumCharsLessThanTenAndGreaterThanTwo, isPositiveDecimalNumber]);
const roundStringToNearestInteger = compose(Math.round, Number);
const convertNumberFromBinaryToDecimalPromise = pipe(
    getParamsForConvertNumberBaseApi,
    convertNumberBase(api),
    andThen(getResult)
);
const getAnimalByIdPromise = pipe(getAnimal(api), andThen(getResult));

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
    pipe(
        tap(writeLog),
        ifElse(
            validateString,
            pipe(
                roundStringToNearestInteger,
                tap(writeLog),
                convertNumberFromBinaryToDecimalPromise,
                andThen(
                    pipe(
                        tap(writeLog),
                        length,
                        tap(writeLog),
                        square,
                        tap(writeLog),
                        moduloByThree,
                        tap(writeLog),
                        getAnimalByIdPromise,
                        andThen(handleSuccess),
                        otherwise(handleError)
                    )
                ),
                otherwise(handleError)
            ),
            () => handleValidationError(handleError)
        )
    )(value);
};

export default processSequence;
