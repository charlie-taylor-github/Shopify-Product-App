import { Layout, Text, Card, Form, FormLayout, TextField, Button, Toast } from "@shopify/polaris";
import { useEffect, useRef, useState } from "react";

export default function CreateProductForm({ submit, loading, toastActive, setToastActive }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        submit({ title, description });
    }
    return (
        <Layout.Section>
            <Card>
                <Layout>
                    <Layout.Section>
                        <Text as="h1" variant="headingLg">Create a Product</Text>
                    </Layout.Section>
                    <Layout.Section>
                        <Form onSubmit={handleSubmit}>
                            <FormLayout>
                                <TextField
                                    value={title}
                                    onChange={x => setTitle(x)}
                                    label=""
                                    placeholder="title"
                                    autoComplete="off"
                                />
                                <TextField
                                    value={description}
                                    onChange={x => setDescription(x)}
                                    label=""
                                    placeholder="description"
                                    autoComplete="off"
                                />
                                <Button
                                    onClick={handleSubmit}
                                    primary
                                    loading={loading}
                                >
                                    Submit
                                </Button>
                                {/* {toastActive && <Toast
                                    content="product created successfully"
                                    onDismiss={() => setToastActive(!toastActive)}
                                />} */}

                            </FormLayout>
                        </Form>
                    </Layout.Section>
                </Layout>
            </Card>
        </Layout.Section>
    );
}
