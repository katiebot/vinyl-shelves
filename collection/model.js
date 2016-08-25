// collections/model.js

export type Collection = {
    id?: number;
    text: string;
    completed: boolean;
};

// This is the model of our module state (e.g. return type of the reducer)
export type State = Collection[];

// Some utility functions that operates on our model
export const filterCompleted = collections => collections.filter(t => t.completed);

export const filterActive = collections => collections.filter(t => !t.completed);
