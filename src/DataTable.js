import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, ColumnGroup, Column } from 'fixed-data-table-2';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
// import ReactLoading from 'react-loading';
import clone from 'lodash/clone';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import Cell from './Cell';
import Header from './Header';
import { getColumnsGroup, filter, sort } from './utils';
import './data-table.css';

const MAX_HEIGHT = 690;

function prepareColumn({ columns, column, key, props, tableWidth, parentKey }) {
  return {
    ...column,
    key,
    parentKey,
    columnKey: key,
    type: column.type || 'STRING',
    width: column.width || (tableWidth ? tableWidth / Object.keys(columns).length : 100),
    flexGrow: !column.width ? 1 : null,
    headerStyle: { ...props.headerStyle, ...column.headerStyle },
    style: { ...props.style, ...column.style },
  };
}

function prepareColumns({ columns, ...props }) {
  const cols = {};

  Object.keys(columns).filter(key => columns[key].hide !== true).forEach((key) => {
    const column = columns[key];
    cols[key] = prepareColumn({ columns, column, key, ...props });
  });

  return cols;
}

function prepareGroupColumns({ columns, ...props }) {
  const cols = {};
  Object.keys(columns).filter(key => columns[key].hide !== true).forEach((key) => {
    let column = columns[key];

    if (column.columns) {
      column.columns = prepareColumns({ columns: column.columns, parentKey: key, ...props });
    } else {
      column = { columns: { [key]: prepareColumn({ columns, column, key, parentKey: key, ...props }) } };
    }

    cols[key] = prepareColumn({ columns, column, key, ...props });
  });
  return cols;
}

// const Loading = () => <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center' }}><ReactLoading type="spin" color="#626466" height={50} width={50} /></div>;
const screenHeight = window.screen.height - 200;

class DataTable extends Component {
  constructor(props) {
    super(props);
    const { rows, columns, getRows } = props;

    this.startRows = rows.slice();
    // this.columns = this.getColumns(props);
    this.state = {
      // rows: this.getRows(),
      columns: this.getColumns(props),
    };

    this.state.rows = this.getRows();

    if (getRows) getRows(this.state.rows);

    this.onSearch = this.onSearch.bind(this);
    this.onSort = this.onSort.bind(this);
    this.renderGroup = this.renderGroup.bind(this);
    this.renderColumn = this.renderColumn.bind(this);
    this.setColumn = this.setColumn.bind(this);
    this.debounce = this.debounce.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { rows, columns, getRows } = nextProps;
    if (rows !== this.props.rows) {
      this.startRows = rows.slice();
      this.setState({ rows: this.getRows(), columns: this.getColumns(nextProps) }, () => (getRows ? getRows(this.state.rows) : null));
    }

    if (columns !== this.props.columns) {
      this.setState({ columns: this.getColumns(nextProps) });
    }
  }

  getColumns(props) {
    this.hasGroup = Object.keys(props.columns).some(key => props.columns[key].columns);
    const columns = clone(this.hasGroup ? prepareGroupColumns({ columns: props.columns, props }) : prepareColumns({ columns: props.columns, props }));
    return columns;
  }

  getFilteredColumns() {
    const columns = getColumnsGroup(this.state.columns);
    const filteredColumns = Object.keys(columns).filter(key => columns[key].searchValue).map(key => columns[key]);
    return filteredColumns;
  }

  getFilteredRows() {
    const filteredColumns = this.getFilteredColumns();
    return filter(this.startRows.slice(), filteredColumns);
  }

  getRows() {
    return this.getFilteredRows();
  }

  async debounce() {
    const result = await AwesomeDebouncePromise(() => this.getRows(), 500)();
    return result;
  }

  setColumn(params) {
    const key = params.column.key;
    const parentKey = params.column.parentKey;
    const columns = this.getColumns(this.props);
    const column = this.hasGroup ? columns[parentKey].columns[key] : columns[key];
    column.searchValue = params.value;
    if (this.hasGroup) {
      columns[parentKey].columns[key] = column;
    } else {
      columns[key] = column;
    }
    this.setState({ columns }, () => {
      this.onSearch();
    });
  }

  async onSearch() {
    const { getRows, getColumns } = this.props;
    const rows = await this.debounce();
    this.setState({ rows }, () => {
      if (getRows) getRows(this.state.rows);
      if (getColumns) getColumns(this.state.columns);
    });
  }

  onSort(column) {
    if (column.sortable === false) return;
    const { state } = this;
    const { rows, columns } = state;

    column.sorted = !column.sorted;
    Object.keys(columns).forEach((key) => {
      if (columns[key] !== column) columns[key].sorted = undefined;
    });

    this.setState({ rows: sort(rows, column) });
  }

  renderGroup({ columns, label, headerStyle, ...props }) {
    return (
      <ColumnGroup
        {...props}
        header={<Header column={{ headerStyle }} group>{label}</Header>}
      >
        {Object.keys(columns).map((key) => {
          const column = columns[key];
          return this.renderColumn(column);
        })}
      </ColumnGroup>
    );
  }

  renderColumn(column) {
    const { rows } = this.state;
    const { label, footer } = column;

    return (
      <Column
        {...column}
        header={
          <Header
            column={column}
            rows={this.startRows}
            onSearch={this.setColumn}
            onSort={this.onSort}
          >
            {label}
          </Header>
        }
        cell={({ rowIndex, ...cellProps }) => (
          <Cell
            {...cellProps}
            rowIndex={rowIndex}
            row={rows[rowIndex]}
            rows={rows}
            column={column}
            onClick={this.props.onClick}
          />
        )}
        footer={({ columnKey }) => (footer ? <Cell columnKey={columnKey} column={{ ...column, cellRenderer: null }} row={{ [columnKey]: footer({ columnKey, rows }) }} /> : null)}
      />
    );
  }

  renderColumns() {
    const { columns } = this.state;
    const render = this.hasGroup ? this.renderGroup : this.renderColumn;
    return Object.keys(columns).map(key => render(columns[key]));
  }

  render() {
    const { height, fullWidth, toolbar, ...props } = this.props;
    const { contentHeight } = this.state;
    if (fullWidth) {
      props.height = height;
    } else {
      props.maxHeight = height;
    }
    return (
      <div style={{ width: props.width, marginLeft: 'auto', marginRight: 'auto' }}>
        {toolbar}
        <div style={{ height: contentHeight > height ? height : contentHeight }} >
          <AutoSizer key="table">
            {({ width }) => (
              <Table
                {...props}
                width={width}
                rowsCount={this.state.rows.length}
                onContentHeightChange={h => this.setState({ contentHeight: h })}
              >
                {this.renderColumns()}
              </Table>
            )}
          </AutoSizer>
        </div>
      </div>
    );
  }
}

DataTable.propTypes = {
  columns: PropTypes.object.isRequired,
  rows: PropTypes.array.isRequired,
  onClick: PropTypes.func,
  maxHeight: PropTypes.number,
  height: PropTypes.number,
  width: PropTypes.string,
  toolbar: PropTypes.node,
  getRows: PropTypes.func,
};

DataTable.defaultProps = {
  columns: {},
  rows: [],
  height: screenHeight > MAX_HEIGHT ? MAX_HEIGHT : screenHeight,
  fullWidth: false,
  headerHeight: 70,
  rowHeight: 40,
  groupHeaderHeight: 40,
  width: '100%',
  toolbar: null,
  getRows: null,
  onClick: null,
  footerHeight: 0,
};


export default DataTable;
