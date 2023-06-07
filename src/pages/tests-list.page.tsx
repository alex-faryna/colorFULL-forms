import styled from "@emotion/styled";

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
`;

const Card = styled.div`
  border: 1px solid #ccc;
  border-radius: 4px;
  max-width: 300px;
  padding: 1rem;
  height: 200px;
`;

function TestCard({ name }: { name: string }) {
    return <Card>{ name }</Card>
}

function TestsListPage() {
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
        <Grid>
            {
                tests.map(test => <TestCard key={test.id} name={test.name} />)
            }
        </Grid>
    </ColumnContainer>
}

export default TestsListPage;
