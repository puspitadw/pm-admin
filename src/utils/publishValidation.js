export function validatePublishFlow(nodes, edges) {
  if (!nodes || nodes.length === 0) {
    return {
      status: 'EMPTY',
      message: 'Canvas is empty. Nothing to publish.',
      type: 'warning',
    }
  }

  const hasUnconnectedNode = nodes.some(node => {
    return !edges.some(
      edge => edge.source === node.id || edge.target === node.id
    )
  })

  if (hasUnconnectedNode) {
    return {
      status: 'INVALID',
      message: 'Please check your design. Some processors are not connected.',
      type: 'warning',
    }
  }

  return {
    status: 'VALID',
    type: 'success',
    message: 'All processors are properly connected. Ready to publish!'
  }
}