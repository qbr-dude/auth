import { createEvent, createStore } from "effector";

// TODO to API

export const openModal = createEvent();
export const closeModal = createEvent();

export const $modal = createStore(false).on(openModal, () => true).on(closeModal, () => false);