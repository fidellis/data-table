import React from 'react';
import ReactLoading from 'react-loading';

const styles = {
  container: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: 4,
    color: '#626466',
  },
  actions: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    width: '100%',
  },
  title: {
    whiteSpace: 'nowrap',
    marginTop: 'auto',
  },
  action: {
    marginLeft: 6,
    marginTop: 2,
  },
};

const ToolBar = (props) => {
  const { title, actions } = props;
  return (
    <div style={styles.container} id="toolbar">
      {styles.title && <div style={styles.title}>{title}</div>}
      <div style={styles.actions}>
        {actions.map((action, i) => <div key={i} style={styles.action}>{action}</div>)}
      </div>
    </div>
  );
};

ToolBar.defaultProps = {
  title: null,
  actions: []
};

export default ToolBar;
