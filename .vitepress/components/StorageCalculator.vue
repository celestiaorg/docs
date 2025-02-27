<template>
  <div class="storage-calculator">
    <div class="calculator-controls">
      <div class="control-group">
        <label>
          Block Size Configuration:
          <select v-model="selectedConfig" class="select-input">
            <option value="8">8MB blocks every 6s</option>
            <option value="32">32MB blocks every 6s</option>
          </select>
        </label>
      </div>
      
      <div class="control-group">
        <label>
          Archival Retention Period: {{ retentionMonths }} months
          <input 
            type="range" 
            v-model="retentionMonths" 
            min="1" 
            max="72" 
            class="slider-input"
          >
        </label>
        <div class="retention-info">
          Estimated monthly storage: {{ monthlyStorageFormatted }}
          <br>
          Non-archival nodes retain 1 month of data
        </div>
      </div>
    </div>

    <h3>Data Availability nodes</h3>
    <h4>Non-archival (pruned) DA nodes</h4>
    <div class="results-table">
      <table>
        <thead>
          <tr>
            <th>Node type</th>
            <th>Memory</th>
            <th>CPU</th>
            <th>Disk</th>
            <th>Bandwidth</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Light node</td>
            <td>500 MB RAM</td>
            <td>Single core</td>
            <td>{{ lightNodeStorage }}</td>
            <td>56 Kbps</td>
          </tr>
          <tr>
            <td>Bridge node (pruned)</td>
            <td>64 GB RAM</td>
            <td>8 cores</td>
            <td>{{ prunedBridgeNodeStorage }}</td>
            <td>1 Gbps</td>
          </tr>
          <tr>
            <td>Full storage node (pruned)</td>
            <td>64 GB RAM</td>
            <td>8 cores</td>
            <td>{{ prunedFullNodeStorage }}</td>
            <td>1 Gbps</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h4>Archival DA nodes</h4>
    <div class="results-table">
      <table>
        <thead>
          <tr>
            <th>Node type</th>
            <th>Memory</th>
            <th>CPU</th>
            <th>Disk</th>
            <th>Bandwidth</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Bridge node (archival)</td>
            <td>64 GB RAM</td>
            <td>8 cores</td>
            <td>{{ bridgeNodeStorage }}</td>
            <td>1 Gbps</td>
          </tr>
          <tr>
            <td>Full storage node (archival)</td>
            <td>64 GB RAM</td>
            <td>8 cores</td>
            <td>{{ fullNodeStorage }}</td>
            <td>1 Gbps</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h3>Consensus nodes</h3>
    <h4>Non-archival (default pruning) consensus nodes</h4>
    <div class="results-table">
      <table>
        <thead>
          <tr>
            <th>Node type</th>
            <th>Memory</th>
            <th>CPU</th>
            <th>Disk</th>
            <th>Bandwidth</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Validator</td>
            <td>24 GB RAM</td>
            <td>8 cores</td>
            <td>{{ validatorStorage }}</td>
            <td>1 Gbps</td>
          </tr>
          <tr>
            <td>Consensus node</td>
            <td>24 GB RAM</td>
            <td>8 cores</td>
            <td>{{ consensusStorage }}</td>
            <td>1 Gbps</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h4>Archival consensus nodes</h4>
    <div class="results-table">
      <table>
        <thead>
          <tr>
            <th>Node type</th>
            <th>Memory</th>
            <th>CPU</th>
            <th>Disk</th>
            <th>Bandwidth</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Consensus node</td>
            <td>64 GB RAM</td>
            <td>8 cores</td>
            <td>{{ archivalStorage }}</td>
            <td>1 Gbps</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StorageCalculator',
  data() {
    return {
      selectedConfig: '8', // Default to 8MB blocks
      retentionMonths: 12, // Default to 1 year
    }
  },
  computed: {
    // Calculate storage requirements based on block size
    blocksPerDay() {
      return (24 * 60 * 60) / 6 // Number of 6-second blocks in a day
    },
    dailyStorage() {
      return this.blocksPerDay * parseInt(this.selectedConfig) // MB per day
    },
    monthlyStorage() {
      return this.dailyStorage * 30.44 // MB per month (average)
    },
    monthlyStorageFormatted() {
      const storageInTiB = this.monthlyStorage / (1024 * 1024) // Convert MB to TiB
      return `${storageInTiB.toFixed(2)} TiB`
    },
    retentionStorage() {
      return this.monthlyStorage * this.retentionMonths
    },
    // Convert to appropriate units and scale for different node types
    lightNodeStorage() {
      return '100 GB SSD' // Light node storage is fixed
    },
    bridgeNodeStorage() {
      if (this.selectedConfig === '8') {
        const baseStorage = Math.max(5, Math.ceil(this.retentionStorage / (1024 * 1024)))
        return `${baseStorage} TiB NVME`
      } else {
        const baseStorage = Math.max(20, Math.ceil((this.retentionStorage / (1024 * 1024)) * 4))
        return `${baseStorage} TiB NVME`
      }
    },
    fullNodeStorage() {
      if (this.selectedConfig === '8') {
        const baseStorage = Math.max(5, Math.ceil(this.retentionStorage / (1024 * 1024)))
        return `${baseStorage} TiB NVME`
      } else {
        const baseStorage = Math.max(20, Math.ceil((this.retentionStorage / (1024 * 1024)) * 4))
        return `${baseStorage} TiB NVME`
      }
    },
    validatorStorage() {
      if (this.selectedConfig === '8') {
        const baseStorage = Math.max(3, Math.ceil(this.retentionStorage / (1024 * 1024)))
        return `${baseStorage} TiB NVME`
      } else {
        const baseStorage = Math.max(12, Math.ceil((this.retentionStorage / (1024 * 1024)) * 4))
        return `${baseStorage} TiB NVME`
      }
    },
    consensusStorage() {
      if (this.selectedConfig === '8') {
        const baseStorage = Math.max(3, Math.ceil(this.retentionStorage / (1024 * 1024)))
        return `${baseStorage} TiB NVME`
      } else {
        const baseStorage = Math.max(12, Math.ceil((this.retentionStorage / (1024 * 1024)) * 4))
        return `${baseStorage} TiB NVME`
      }
    },
    archivalStorage() {
      if (this.selectedConfig === '8') {
        const baseStorage = Math.max(6, Math.ceil(this.retentionStorage / (1024 * 1024)))
        return `${baseStorage} TiB NVME`
      } else {
        const baseStorage = Math.max(24, Math.ceil((this.retentionStorage / (1024 * 1024)) * 4))
        return `${baseStorage} TiB NVME`
      }
    },
    // Add pruned storage calculations
    prunedBridgeNodeStorage() {
      if (this.selectedConfig === '8') {
        const baseStorage = Math.max(1, Math.ceil(this.monthlyStorage / (1024 * 1024)))
        return `${baseStorage} TiB NVME`
      } else {
        const baseStorage = Math.max(4, Math.ceil((this.monthlyStorage / (1024 * 1024)) * 4))
        return `${baseStorage} TiB NVME`
      }
    },
    prunedFullNodeStorage() {
      if (this.selectedConfig === '8') {
        const baseStorage = Math.max(1, Math.ceil(this.monthlyStorage / (1024 * 1024)))
        return `${baseStorage} TiB NVME`
      } else {
        const baseStorage = Math.max(4, Math.ceil((this.monthlyStorage / (1024 * 1024)) * 4))
        return `${baseStorage} TiB NVME`
      }
    }
  }
}
</script>

<style scoped>
.storage-calculator {
  margin: 2rem 0;
}

.calculator-controls {
  margin-bottom: 2rem;
}

.select-input {
  display: block;
  width: 100%;
  max-width: 300px;
  padding: 0.5rem;
  margin-top: 0.5rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.results-table {
  margin-bottom: 2rem;
}

.results-table table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

.results-table th,
.results-table td {
  padding: 0.75rem;
  text-align: left;
  border: 1px solid var(--vp-c-divider);
}

.results-table th {
  background-color: var(--vp-c-bg-soft);
  font-weight: 600;
}

.results-table tr:nth-child(even) {
  background-color: var(--vp-c-bg-soft);
}

h3 {
  margin-top: 2rem;
  margin-bottom: 1rem;
}

h4 {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .results-table {
    overflow-x: auto;
  }
  
  .results-table table {
    min-width: 600px;
  }
}

.control-group {
  margin-bottom: 1.5rem;
}

.slider-input {
  display: block;
  width: 100%;
  max-width: 300px;
  margin-top: 0.5rem;
  accent-color: var(--vp-c-brand);
}

.retention-info {
  margin-top: 0.5rem;
  font-size: 0.9em;
  color: var(--vp-c-text-2);
}
</style> 