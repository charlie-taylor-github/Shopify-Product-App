import { Card, Text, Layout, DataTable, ButtonGroup, Button } from "@shopify/polaris";
import { ChevronLeftMinor, ChevronRightMinor } from '@shopify/polaris-icons';
import { useState } from "react";

export default function ProductTable({ rows, products, productsLoaded, requestMoreProducts }) {
    const [index, setIndex] = useState(0);

    function moveBack() {
        setIndex(index - rows);
    }

    function moveForward() {
        setIndex(index + rows);
        requestMoreProducts();
    }

    return (
        <Layout.Section>
            <Card>
                <Layout>
                    <Layout.Section>
                        <Text as="h1" variant="headingLg">Products</Text>
                    </Layout.Section>
                    <Layout.Section>
                        <DataTable
                            columnContentTypes={[
                                "text",
                                "text"
                            ]}
                            headings={["Title", "Description"]}
                            rows={products.slice(index, index + rows)
                                .map(p => [p.title, p.description])
                            }
                        />
                    </Layout.Section>
                    <Layout.Section>
                        <ButtonGroup>
                            <Button
                                icon={ChevronLeftMinor}
                                onClick={moveBack}
                                disabled={index < rows}
                            />
                            <Button
                                icon={ChevronRightMinor}
                                onClick={moveForward}
                                loading={!productsLoaded && index >= products.length - rows}
                                disabled={productsLoaded && index >= products.length - rows}
                            />
                        </ButtonGroup>
                    </Layout.Section>
                </Layout>
            </Card>
        </Layout.Section>
    );
};
