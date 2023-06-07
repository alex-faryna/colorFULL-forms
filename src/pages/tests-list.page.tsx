import styled from "@emotion/styled";
import {cloneElement, Component, createRef, Fragment, useRef} from "react";
import useResize from "../utils/resize";
import {Flipped, Flipper} from "react-flip-toolkit";

class FlipAnimated extends Component {
    private ref = createRef<HTMLElement>();

    getSnapshotBeforeUpdate() {
        console.log('p');
        if (this.ref.current) {
            // first
            return this.ref.current.getBoundingClientRect();
        }
        return null;
    }

    // below `snapshot` is whatever returned `getSnapshotBeforeUpdate`
    componentDidUpdate(prevProps: any, prevState: any, snapshot: any) {
        console.log('p');
        if (this.ref.current) {
            const first = snapshot;
            // last
            const last = this.ref.current.getBoundingClientRect();
            // invert
            const deltaX = last.left - first.left;
            const deltaY = last.top - first.top;

            this.ref.current.animate([
                { transform: `translate(${-deltaX}px, ${-deltaY}px)` },
                // play
                { transform: 'translate(0,0)' },
            ], {
                duration: 300,
                easing: 'ease-out',
            });
        }
    }
    render() {

        console.log("bro");
        // @ts-ignore
        return this.props.children;
    }
}

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  align-items: center;
`;

const Grid = styled.div`
  max-width: 2000px;
  width: 70%;
  padding: 4rem 2rem;
  display: grid;
  gap: 12px;
  grid-template-columns: repeat( auto-fill, minmax(250px, 1fr) );
  align-items: center;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  height: 200px;
  align-items: center;
`;

const InnerCard = styled.div`
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  height: 100%;
  max-width: 300px;
`;

function TestCard({ name }: { name: string }) {
    return <Card>
        <InnerCard>{ name }</InnerCard>
    </Card>
}

function TestsListPage() {
    const grid = useRef<HTMLDivElement>(null);
    const width = useResize(grid, 150);

    const tests = [
        {
            id: 0,
            name: 'Test 1',
        },
        {
            id: 1,
            name: 'Test 2',
        },
        {
            id: 3,
            name: 'Test 3',
        },
        {
            id: 4,
            name: 'Test 4',
        },
        {
            id: 5,
            name: 'Test 5',
        },
    ]

    return <ColumnContainer>
        <Grid ref={grid}>
            {
                tests.map(test => <TestCard key={test.id} name={test.name} />)
            }
        </Grid>
    </ColumnContainer>
}

export default TestsListPage;
