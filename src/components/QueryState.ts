import { createState, useState } from '@hookstate/core';

const queryState = createState({
    query: ""
})

export function useQueryState() {
    const state = useState(queryState)

    return ({
        get query() {
            return state.query.get()
        },
        setQuery(value: string) {
            state.query.set(value)
        }
    })   
}
