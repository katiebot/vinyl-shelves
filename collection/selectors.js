// collections/selectors.js

import { createSelector } from 'reselect';
import _ from 'lodash';
import { NAME } from './constants';
import { filterActive, filterCompleted } from './model';

export const getAll = state => state[NAME];

export const getCompleted = _.compose(filterCompleted, getAll);

export const getActive = _.compose(filterActive, getAll);

export const getCounts = createSelector(
        getAll,
        getCompleted,
        getActive,
        (allCollections, completedCollections, activeCollections) => ({
        all: allCollections.length,
        completed: completedCollections.length,
        active: activeCollections.length
    })
);
