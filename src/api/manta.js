import { MantaClient } from 'mantahq-sdk'

// Initialize the Manta client
const manta = new MantaClient({
    sdkKey: import.meta.env.VITE_MANTAHQ_API_KEY,
})

export async function createRecord(itemData) {
    try {
        const response = await manta.createRecords({
            table: 'items',
            data: [itemData]
        });
        return response
    } catch (error) {
        console.log('Manta create error', error)
    }
}

export async function fetchAllRecords() {
    const response = await manta.fetchAllRecords({
        table: 'items'
    })

    console.log(response, 'response')
    return response.data
}