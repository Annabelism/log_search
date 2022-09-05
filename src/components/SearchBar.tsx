import React from 'react';
import { useQueryState } from './QueryState';
import { Input, Button } from "@material-ui/core";
import { useState } from "@hookstate/core";
import { useLogsState } from "./LogsState";

export function SearchBar() {
  const queryState = useQueryState();
  const logState = useLogsState();
  const localQuery = useState("");

  function submitSearch() {
    // set the global query state
    // this value is not used anywhere else at this point, but it could be used in another component by importing the global useQueryState
    queryState.setQuery(localQuery.get());

    // request a new elasticsearch search and reset the existing search
    // instead of "term" query, we could consider "match": https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query.html
    logState.setLogLines([
      {
        "term": {
          "content": localQuery.get()
        }
      }
    ], 10, 10, 0, true)
  }

  return <div className="log-search-bar">
    <div>
      <Input
        onChange={(event => localQuery.set(event.target.value))}
        onKeyPress={(event) => {
          if (event.key === 'Enter') {
            submitSearch();
            event.preventDefault();
          }
        }}
      />
    </div>
    <div>
      <Button variant="outlined" onClick={submitSearch}>Search</Button>
    </div>
  </div>
}
