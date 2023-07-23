/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import {
    all,
    allPass,
    any,
    apply,
    both,
    complement,
    compose,
    converge,
    countBy,
    curry,
    equals,
    filter,
    flip,
    gte,
    has,
    identity,
    juxt,
    keys,
    length,
    map,
    omit,
    partial,
    partialRight,
    pick,
    prop,
    props,
    values,
} from "ramda";
import { COLORS, SHAPES } from "../constants";

const curriedEquals = curry(equals);
const curriedAll = curry(all);
const curriedFilter = curry(filter);
const curriedFlippedGte = curry(flip(gte));
const appliedEquals = apply(equals);
const valuesComposeRight = partialRight(compose, [values]);
const countKeys = compose(length, keys);
const countKeysCompose = partial(compose, [countKeys]);
const countKeysComposeRight = partialRight(compose, [countKeys]);
const countByIdentity = countBy(identity);
const [isGreaterOrEqualTwo, isGreaterOrEqualThree] = map(curriedFlippedGte, [2, 3]);
const isAnyGreaterOrEqualThree = any(isGreaterOrEqualThree);

const [TRIANGLE, SQUARE, CIRCLE, STAR] = juxt(map(prop, ["TRIANGLE", "SQUARE", "CIRCLE", "STAR"]))(
    SHAPES
);
const [RED, BLUE, ORANGE, GREEN, WHITE] = juxt(
    map(prop, ["RED", "BLUE", "ORANGE", "GREEN", "WHITE"])
)(COLORS);

const [getSquare, getCircle, getStar] = map(prop, [SQUARE, CIRCLE, STAR]);
const [isEqualTwo, isEqualOne, isRed, isGreen, isWhite, isBlue, isOrange] = map(curriedEquals, [
    2,
    1,
    RED,
    GREEN,
    WHITE,
    BLUE,
    ORANGE,
]);
const [isNotWhite, isNotRed] = map(complement, [isWhite, isRed]);
const isNotRedAndNotWhite = both(isNotRed, isNotWhite);
const isStarRed = compose(isRed, getStar);
const isSquareGreen = compose(isGreen, getSquare);
const isCircleBlue = compose(isBlue, getCircle);
const isSquareOrange = compose(isOrange, getSquare);
const isStarNotRedAndNotWhite = compose(isNotRedAndNotWhite, getStar);
const [isAllWhite, isAllOrange, isAllGreen, isAllNotWhite] = map(curriedAll, [
    isWhite,
    isOrange,
    isGreen,
    isNotWhite,
]);
const [isTwoKeys, isOneKeys] = map(countKeysComposeRight, [isEqualTwo, isEqualOne]);
const [filterGreen, filterRed, filterBlue, filterNotWhite] = map(curriedFilter, [
    isGreen,
    isRed,
    isBlue,
    isNotWhite,
]);
const [countGreenKeys, countRedKeys, countBlueKeys] = map(countKeysCompose, [
    filterGreen,
    filterRed,
    filterBlue,
]);
const [
    isAllValuesWhite,
    isAllValuesOrange,
    isAllValuesGreen,
    isAnyValuesGreaterOrEqualThree,
    filterNotWhiteValues,
] = map(valuesComposeRight, [
    isAllWhite,
    isAllOrange,
    isAllGreen,
    isAnyGreaterOrEqualThree,
    filterNotWhite,
]);
const hasTriangle = has(TRIANGLE);
const isTwoKeysAndHasTriangle = both(isTwoKeys, hasTriangle);
const isTwoGreenIncludesTriangle = compose(isTwoKeysAndHasTriangle, filterGreen);
const isOneRed = compose(isOneKeys, filterRed);
const getShapesValues = pick(values(SHAPES));
const isSameColorAndNotWhite = both(appliedEquals, isAllNotWhite);

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([
    isStarRed,
    isSquareGreen,
    compose(isAllValuesWhite, omit([STAR, SQUARE])),
]);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = compose(isGreaterOrEqualTwo, countGreenKeys);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = converge(equals, [countRedKeys, countBlueKeys]);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([isCircleBlue, isStarRed, isSquareOrange]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = compose(
    isAnyValuesGreaterOrEqualThree,
    countByIdentity,
    filterNotWhiteValues
);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = both(isTwoGreenIncludesTriangle, isOneRed);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = compose(isAllValuesOrange, getShapesValues);

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = isStarNotRedAndNotWhite;

// 9. Все фигуры зеленые.
export const validateFieldN9 = compose(isAllValuesGreen, getShapesValues);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = compose(isSameColorAndNotWhite, props([TRIANGLE, SQUARE]));
