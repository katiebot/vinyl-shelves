import { createStructuredSelector } from 'reselect';
import { getAll } from '../selectors';
import CollectionItem from './CollectionItem';

const CollectionList = ({ collections }) => (
<div>
collections.map(t => <CollectionItem collection={t}/>)
</div>
);

export default connect(
    createStructuredSelector({
        collections: getAll
    })
)(CollectionList);
