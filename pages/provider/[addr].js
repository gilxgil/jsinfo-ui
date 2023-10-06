import { GetRestUrl } from '../../src/utils';
import Link from 'next/link';
import { Flex, Text, Card, Box, Table, Container, Tabs } from '@radix-ui/themes';

export default function Provider({ provider }) {
    if (provider == undefined) {
        return (
            <div>Loading</div>
        )
    }

    return (
        <Container>
            <Card>
                <Flex gap="3" align="center">
                    <Box>
                        <Text as="div" size="2" weight="bold">
                            {provider.moniker}
                        </Text>
                        <Text as="div" size="2" color="gray">
                            {provider.addr}
                        </Text>
                    </Box>
                </Flex>
            </Card>
            
            <Box>
                <Flex gap="3" justify="between">
                    <Card>
                        <Text as="div" size="2" weight="bold">
                            cu sum: {provider.cuSum}
                        </Text>
                    </Card>
                    <Card>
                        <Text as="div" size="2" weight="bold">
                            relay sum: {provider.relaySum}
                        </Text>
                    </Card>
                    <Card>
                        <Text as="div" size="2" weight="bold">
                            reward sum: {provider.rewardSum}
                        </Text>
                    </Card>
                    <Card>
                        <Text as="div" size="2" weight="bold">
                            stake sum:
                        </Text>
                    </Card>
                </Flex>
            </Box>

            <Tabs.Root defaultValue="events">
                <Tabs.List>
                    <Tabs.Trigger value="events">events</Tabs.Trigger>
                    <Tabs.Trigger value="stakes">stakes</Tabs.Trigger>
                    <Tabs.Trigger value="rewards">rewards</Tabs.Trigger>
                    <Tabs.Trigger value="reports">reports</Tabs.Trigger>
                </Tabs.List>

                <Box px="4" pt="3" pb="2">
                    <Tabs.Content value="events">
                        <Card>
                            Events
                            <Table.Root>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.ColumnHeaderCell>Event Type</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>Block</Table.ColumnHeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {provider.events.map((evt) => {
                                        return (<Table.Row key={`evt_${evt.id}`}>
                                            <Table.RowHeaderCell>{evt.eventType}</Table.RowHeaderCell>
                                            <Table.Cell>{evt.blockId}</Table.Cell>
                                        </Table.Row>
                                        )
                                    })}
                                </Table.Body>
                            </Table.Root>
                        </Card>
                    </Tabs.Content>

                    <Tabs.Content value="stakes">
                        <Card>
                            Stakes
                            <Table.Root>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.ColumnHeaderCell>Spec</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>Stake</Table.ColumnHeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {provider.stakes.map((stake) => {
                                        return (<Table.Row key={`${stake.specId}${stake.provider}`}>
                                            <Table.RowHeaderCell>{stake.specId}</Table.RowHeaderCell>
                                            <Table.Cell>{stake.stake}</Table.Cell>
                                        </Table.Row>
                                        )
                                    })}
                                </Table.Body>
                            </Table.Root>
                        </Card>
                    </Tabs.Content>

                    <Tabs.Content value="rewards">
                        <Card>
                            Rewards
                            <Table.Root>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.ColumnHeaderCell>Spec</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>Block</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>Consumer</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>Relays</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>CU</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>Pay</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>QoS</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>Excellence</Table.ColumnHeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {provider.payments.map((payment) => {
                                        return (<Table.Row key={`pay_${payment.id}`}>
                                            <Table.RowHeaderCell>{payment.specId}</Table.RowHeaderCell>
                                            <Table.Cell>{payment.blockId}</Table.Cell>
                                            <Table.Cell><Link href={`/consumer/${payment.consumer}`}>{payment.consumer}</Link></Table.Cell>
                                            <Table.Cell>{payment.relays}</Table.Cell>
                                            <Table.Cell>{payment.cu}</Table.Cell>
                                            <Table.Cell>{payment.pay} ULAVA</Table.Cell>
                                            <Table.Cell>{payment.qosSync}, {payment.qosAvailability}, {payment.qosSync}</Table.Cell>
                                            <Table.Cell>{payment.qosSyncExc}, {payment.qosAvailabilityExc}, {payment.qosSyncExc}</Table.Cell>
                                        </Table.Row>
                                        )
                                    })}
                                </Table.Body>
                            </Table.Root>
                        </Card>
                    </Tabs.Content>

                    <Tabs.Content value="reports">
                        <Card>
                            Reports
                            <Table.Root>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.ColumnHeaderCell>Block</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>CU</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>Disconnections</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>Errors</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>Project</Table.ColumnHeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {provider.reports.map((report, i) => {
                                        return (<Table.Row key={`report_${report.provider}_${report.blockId}_${i}`}>
                                            <Table.RowHeaderCell>{report.blockId}</Table.RowHeaderCell>
                                            <Table.Cell>{report.cu}</Table.Cell>
                                            <Table.Cell>{report.disconnections}</Table.Cell>
                                            <Table.Cell>{report.errors}</Table.Cell>
                                            <Table.Cell>{report.project}</Table.Cell>
                                        </Table.Row>
                                        )
                                    })}
                                </Table.Body>
                            </Table.Root>
                        </Card>
                    </Tabs.Content>
                </Box>
            </Tabs.Root>
        </Container>
    )
}

export async function getStaticPaths() {
    const providers = await getProviders()
    let paths = []
    providers.providers.forEach(provider => {
        paths.push({
            params: {
                addr: provider.address
            }
        })
    });

    return {
        paths: paths,
        fallback: true,
    };
}

export async function getStaticProps({ params }) {
    const addr = params.addr
    if (!addr.startsWith('lava@') || addr.length != 44) {
        return {
            notFound: true,
        }
    }

    // fetch
    const provider = await getProvider(params.addr)
    if (provider == null) {
        return {
            notFound: true,
        }
    }

    return {
        props: {
            provider
        },
        revalidate: 15,
    }
}

async function getProviders() {
    const res = await fetch(GetRestUrl() + '/providers')
    if (!res.ok) {
        return null
    }
    return res.json()
}

async function getProvider(addr) {
    const res = await fetch(GetRestUrl() + '/provider/' + addr)
    if (!res.ok) {
        return null
    }
    return res.json()
}
