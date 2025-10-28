Recommended approach: Add a new section to submit-data.md

  Why this makes sense:

  1. Natural fit: There's already a section "Submitting multiple transactions in one block from the same account" (lines 178-196) that
  discusses sequence numbers and mempool behavior - this is exactly where parallel submission fits conceptually
  2. User discovery: Anyone reading about how to submit data will naturally find all submission strategies in one place
  3. Context: The parallel submission feature is most relevant when users are already thinking about transaction submission, fees, and
  throughput

  Proposed structure:

  I'd suggest restructuring/expanding the existing section into something like:

  ## Transaction submission strategies

  ### Single transaction submission (default behavior)
  [Current intro about how basic submission works]

  ### Submitting multiple transactions from the same account

  #### Manual sequence management
  [Current content about manually specifying nonces]

  #### Parallel transaction submission with TxWorkerAccounts (NEW)
  - Configuration: Setting TxWorkerAccounts in state config
  - How it works: Subaccounts and parallel lanes
  - Three modes: Default (0), Synchronous (1), Parallel (>1)
  - Important considerations: ordering, default account requirement
  - Retrieving blobs: Using namespace, height, and commitment

  What needs updating:

  1. submit-data.md: Add the new parallel submission section with config examples and important notes
  2. Links: Possibly add a brief mention in quick-start.md or other relevant pages pointing to this section

  Would you like me to proceed with this plan, or would you prefer a separate dedicated page instead?
