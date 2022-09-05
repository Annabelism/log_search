import { createState, useState } from '@hookstate/core';
import { ELASTIC_HOST, ELASTIC_INDEX } from './constants'

export interface Log {
  job_id: number;
  lines: {
    [line_number: number]: {
      content: any;
      offset: number;
      line_number: number;
    }
  }
}

export interface Doc {
  _id: string;
  _source: { job_id: number; content: string; line_number: number; offset: number; }
}

const logState = createState<{ [job_id: string]: Log }>({})

export function useLogsState() {
  const state = useState(logState)

  return ({
    get log() {
      return state.get()
    },
    setLogLines(filters: {}[], file_limit: number = 10, line_limit: number = 10, start: number = 0, reset: boolean = false) {
      // query is a boolean query https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-bool-query.html
      // the filter list represents a list of query clauses that must all be true
      const query = {bool: {filter: filters}}

      // if a "start" line is specified, we add a new element to the filter list that will be evaluated with an "AND" against the rest of the query
      if (start) {
        query.bool.filter.push({range: {line_number: {gt: start}}})
      }
      fetch(
        `${ELASTIC_HOST}/${ELASTIC_INDEX}/_search`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "access-control-request-headers": "content-type, authorization", 
            "authorization": 'Basic ' + btoa('elastic' + ":" + 'h3RXW9askN9WzzVr0yBB'),
          },
          body: JSON.stringify({
            // collapse is a way to group the individual log lines by file id ("job_id" in this case)
            // https://www.elastic.co/guide/en/elasticsearch/reference/current/collapse-search-results.html
            "collapse": {
              "field": "job_id",
              "inner_hits": {
                "name": "lines",
                "size": line_limit,
                "sort": [
                  {
                    "line_number": "asc"
                  }
                ]
              }
            },
            "query": query,
            "size": file_limit
          })
        }
      ).then(response => response.json())
        .then(data => {
          const job_lines = data.hits.hits.map((item: { inner_hits: { lines: { hits: { hits: any[]; }; }; }; _source: { job_id: any; }; }) =>
            item.inner_hits.lines.hits.hits.reduce((initial: any, doc: Doc) => {
            initial.lines[doc._source.line_number] = ({
              content: doc._source.content,
              offset: doc._source.offset,
              line_number: doc._source.line_number
            })
            return initial;
          }, {job_id: item._source.job_id, lines: {}}));

          if (reset) {
            state.set({})
          }

          job_lines.forEach((job: Log) => {
            if (state[job.job_id].get()) {
              state[job.job_id].lines.merge(job.lines)
            } else {
              state.merge({[job.job_id]: job});
            }
          })
        })
    }
  })
}
