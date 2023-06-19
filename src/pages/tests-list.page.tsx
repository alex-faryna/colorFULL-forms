import styled from "@emotion/styled";
import {Component, createRef, useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import {useInViewCallBack} from "../hooks/in-view";
import {createQuizButtonVisibilityService} from "../services/create-quiz-button-visible.service";
import {globalInjector} from "../services/global-injector.service";
import {onAuthStateChanged} from "firebase/auth";
import useAuthUser from "../hooks/auth-user.hook";
import {Test} from "../models/test.model";
import { Timestamp } from 'firebase/firestore';

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
  padding: 2rem;
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
  justify-content: center;
  
  > * {
    display: block;
    width: 100%;
    height: 100%;
    text-decoration-color: #aaa;
    max-width: 300px;
  }
`;

const InnerCard = styled.div`
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  position: relative;
`;

const Placeholder = styled.div`
  width: 100%;
  height: 100%;
  border: 2px dashed #ccc;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  cursor: pointer;
  
  &:hover {
    color: #777;
    border-color: #999;
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 8px;
  
  & .right {
    margin-left: auto;
  }
`;

function TestCard({ test }: { test: Test }) {
    return <Card>
        <InnerCard>
            <Row>
                <span>{ test.title }</span>
                <Link className='right' to={`${test.id}`}>
                    <span>View</span>
                </Link>
                <Link to={`${test.id}/edit`}>
                    <span>Edit</span>
                </Link>
            </Row>
            <p>{ (test.questions || []).length } Questions</p>
        </InnerCard>
    </Card>
}

function AddQuizCard() {
    const elem = useRef<HTMLDivElement>(null);
    useInViewCallBack(elem, val => createQuizButtonVisibilityService.updateVisibility(val));

    return <Card ref={elem}>
        <Link to='0/edit'>
            <Placeholder>
                Create new quiz
            </Placeholder>
        </Link>
    </Card>;
}

function TestsListPage() {
    const [user] = useAuthUser(globalInjector.authService);
    const [tests, setTests] = useState<Test[]>([]);

    useEffect(() => {
        if (user) {
            globalInjector.db.getTestsList(0, 20, user.uid)
                .then(val => setTests(val))
                .catch(err => console.log(err));
        }
    }, [user]);

    return <ColumnContainer>
        <Grid>
            <AddQuizCard />
            {
                tests.map(test => <TestCard key={test.id} test={test} />)
            }
        </Grid>
    </ColumnContainer>
}

export default TestsListPage;
