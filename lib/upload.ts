export async function uploadToIPFS(file: File): Promise<{ cid: string; url: string }> {
  const token = process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN
  if (!token) {
    // Fallback mock for development without token
    const mockCid = `bafy${Math.random().toString(36).slice(2, 10)}`
    return { cid: mockCid, url: URL.createObjectURL(file) }
  }

  const form = new FormData()
  form.append('file', file)

  const res = await fetch('https://api.web3.storage/upload', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Upload failed: ${res.status} ${text}`)
  }
  const data = await res.json()
  const cid = data?.cid || data?.cid?.toString?.() || ''
  return { cid, url: `https://ipfs.io/ipfs/${cid}` }
}




