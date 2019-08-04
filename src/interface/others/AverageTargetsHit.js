import React from 'react';
import PropTypes from 'prop-types';

class AverageTargetsHit extends React.PureComponent {
  static propTypes = {
    casts: PropTypes.number.isRequired,
    hits: PropTypes.number.isRequired,
    unique: PropTypes.bool,
    approximate: PropTypes.bool,
  };

  render() {
    const { casts, hits, unique, approximate } = this.props;
    const averageHits = ((hits / casts) || 0).toFixed(1);
    if (!unique) {
      return (
        <>
          {approximate && '≈'}{averageHits} <small>average {averageHits > 1 ? 'targets hit per cast' : 'target hit per cast'}</small>
        </>
      );
    } else {
      return (
        <>
          {approximate && '≈'}{averageHits} <small>unique {averageHits > 1 ? 'targets per cast' : 'target per cast'}</small>
        </>
      );
    }
  }
}

export default AverageTargetsHit;

AverageTargetsHit.defaultProps = {
  approximate: false,
};

